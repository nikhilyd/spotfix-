import Complaint from "../models/complaint.model.js"
import { main } from "../service/gemini.service.js";
import { uploadoncloudinary } from "../utils/cloudinary.js";
import { Officer } from "../models/officer.model.js";
import { reverseGeocode } from "../service/map.serivice.js";
import { sendmessagetosocket } from "../socket.js";
import { sendWhatsAppMessage } from "../service/twillo.service.js";
import { createTaskLink } from "../utils/createTaskLink.js";
import workerModel from "../models/worker.model.js";
import { senttomail } from "../service/mail.service.js";

const fallbackLabels = {
    garbage: { title: "Garbage Dumping Issue", description: "Improper garbage disposal or waste accumulation reported" },
    pothole: { title: "Pothole on Road", description: "Pothole or road surface damage reported" },
    water: { title: "Water Supply Issue", description: "Water leakage, shortage, or contamination reported" },
    electricity: { title: "Electricity Issue", description: "Power outage, faulty wiring, or electrical hazard reported" },
    road: { title: "Road Damage Issue", description: "Road surface damage, cracks, or broken pavement reported" },
    other: { title: "Civic Issue Reported", description: "A community issue has been reported for attention" }
};

const departmentMap = {
    garbage: "waste_management",
    pothole: "public_works",
    water: "water_supply",
    electricity: "electricity",
    road: "public_works",
    other: "other"
};

export const createcomplaint = async(req,res) => {
    try {
        const user = req.user._id
        const {name,lon,lat,address,phone,problemType,title:userTitle,description:userDesc} = req.body;

        function buildFallback(ptype, addr) {
            const label = fallbackLabels[ptype] || fallbackLabels.other;
            return {
                title: label.title,
                description: addr ? `${label.description} at ${addr}` : label.description,
                department: departmentMap[ptype] || "other",
                problem_type: ptype || "other",
                severity_level: "medium",
                skills: ["general_worker"]
            };
        }

        let imageurl = null;
        if (req.file) {
            imageurl = await uploadoncloudinary(req.file.buffer);
        }

        let data = {};
        if (imageurl) {
            try {
                data = await main(imageurl);
            } catch (err) {
                console.error('Gemini analysis failed:', err);
                data = buildFallback(problemType, address);
            }
        } else {
            data = buildFallback(problemType, address);
        }

        let officer = null;
        const findOfficer = async (department) => {
            if (lat && lon) {
                try {
                    const city = await reverseGeocode(lat, lon);
                    const cityName = Array.isArray(city) ? city[1] : city;
                    if (cityName) {
                        const match = await Officer.findOne({city: cityName, department});
                        if (match) return match;
                    }
                } catch (err) {
                    console.error('Geocoding failed:', err);
                }
            }
            return await Officer.findOne({department});
        };

        officer = await findOfficer(data.department);
        if (!officer && problemType && departmentMap[problemType] !== data.department) {
            officer = await findOfficer(departmentMap[problemType]);
        }
        if (!officer) {
            officer = await Officer.findOne();
        }

        const complaint = await Complaint.create({
            user,
            name,
            title: userTitle || data.title || data.problem_type || "Issue",
            description: userDesc || data.description,
            media: imageurl || undefined,
            location: lat && lon ? { lat: Number(lat), lon: Number(lon) } : undefined,
            address: address || 'Location not specified',
            phone,
            department: data.department,
            problem_type: data.problem_type,
            skills: data.skills,
            severity_level: data.severity_level,
            officer: officer?._id
        })

        if (!complaint) {
            return res.status(400).json({message:"error"});
        }

        if (officer?.socketId) {
            sendmessagetosocket(officer.socketId, {
                event:'complaint-come',
                data:complaint
            });
        }

        res.status(200).json({
            complaint,
            message:"complaint created successfully"
        })
    } catch (error) {
        console.error('Create complaint error:', error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const allcomplaint = async(req,res) => {
    try {
        const id = req.query.id;
        const complaint = await Complaint.find({officer:id});
        res.status(200).json({complaint,message:"complaint"});
    } catch (error) {
        res.status(500).json({message:"error"});
    }
}

export const assignedWorker = async(req,res) => {
    try {
        const {complaint,worker} = req.body;
        const link = createTaskLink(complaint._id.toString());
        const loc = complaint.address || (complaint.location ? `${complaint.location.lat},${complaint.location.lon}` : 'Not provided');
        const issue = complaint.problem_type || complaint.title || complaint.description || 'Issue reported';
        const message = `🚨 New Work Assigned!\n\n📍 Location: ${loc}\n📷 Issue: ${issue}\n\n🔗 Open task and upload proof:\n${link}\n\nPlease complete and upload proof.`;

        try { await sendWhatsAppMessage(worker.phone,message); } catch (e) { console.error('WhatsApp send failed:', e); }
        try { await senttomail(worker.name,worker.email,message); } catch (e) { console.error('Email send failed:', e); }

        const complaint2 = await Complaint.findByIdAndUpdate(complaint._id,{assignedWorker:worker._id,status:"Assigned"},{new:true});
        const worker2 = await workerModel.findByIdAndUpdate(worker._id,{status:"busy"},{new:true});
        if(!complaint2){
            return res.status(400).json({message:"error"});
        }
        return res.status(200).json({complaint:complaint2, message:"assigned work successfully"});
    } catch (error) {
        console.error('Assign worker error:', error);
        res.status(500).json({message:"Internal server error"});
    }
}

export const usercomplaint = async(req,res) => {
    try {
        const id = req.query.id;
        const complaint = await Complaint.find({user:id});
        res.status(200).json({complaint,message:"complaint"});
    } catch (error) {
        res.status(500).json({message:"error"});
    }
}

export const analyzeImage = async(req,res) => {
    try {
        if (!req.file) {
            return res.status(400).json({message: "No image provided"});
        }

        const imageurl = await uploadoncloudinary(req.file.buffer);
        if (!imageurl) {
            return res.status(500).json({message: "Image upload failed"});
        }

        const result = await main(imageurl);
        res.status(200).json({
            title: result.title || "Issue detected",
            description: result.description || "Issue detected from image analysis",
            problem_type: result.problem_type || "other",
            severity_level: result.severity_level || "medium",
            department: result.department || "other",
            skills: result.skills || ["general_worker"]
        });
    } catch (error) {
        console.error('Image analysis error:', error);
        res.status(500).json({message: "Image analysis failed"});
    }
};

export const deletecomplaint = async(req,res) => {
    try {
        const complaintId = req.params.id;
        const userId = req.user._id;

        const complaint = await Complaint.findById(complaintId);
        if (!complaint) {
            return res.status(404).json({message:"Complaint not found"});
        }

        if (complaint.user.toString() !== userId.toString()) {
            return res.status(403).json({message:"Unauthorized to delete this complaint"});
        }

        await Complaint.findByIdAndDelete(complaintId);
        res.status(200).json({message:"Complaint deleted successfully"});
    } catch (error) {
        console.error('Delete complaint error:', error);
        res.status(500).json({message:"Internal server error"});
    }
}
