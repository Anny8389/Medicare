// Dependencies
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// middleware and config(S)
dotenv.config();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// email transporter setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.APP_USER,  // Gmail from .env
        pass: process.env.APP_PASS   // Gmail App Password from .env
    }
});

// route to send emails
app.post("/send-email", async (req, res) => {
    const { Full_Name, Work_Email, HospitalFacility, role, Hospital_Size } = req.body;

    // Validate required fields
    if (!Full_Name || !Work_Email || !HospitalFacility || !role || !Hospital_Size) {
        return res.status(400).json({ 
            message: "Full_Name, Work_Email, HospitalFacility, role, and Hospital_Size are required." 
        });
    }

    try {
        // Professional Email Template
        const mailOptions = {
            from: `"Medicare Team" <${process.env.APP_USER}>`,
            to: Work_Email,
            subject: `Welcome to Medicare, ${Full_Name}!`,
            text: `Hello ${Full_Name},\n\nThank you for joining Medicare.\nYour details:\n- Hospital Facility: ${HospitalFacility}\n- Role: ${role}\n- Hospital Size: ${Hospital_Size}\n\nBest Regards,\nMedicare Team`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9;">
                    <h2 style="color: #2E86C1;">Welcome to Medicare</h2>
                    <p style="font-size: 16px; color: #333;">Hello <strong>${Full_Name}</strong>,</p>
                    <p style="font-size: 14px; color: #555;">
                        Thank you for joining Medicare! Below are your details:
                    </p>
                    <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
                        <tr><td style="padding: 8px; font-weight: bold;">Hospital Facility:</td><td>${HospitalFacility}</td></tr>
                        <tr><td style="padding: 8px; font-weight: bold;">Role:</td><td>${role}</td></tr>
                        <tr><td style="padding: 8px; font-weight: bold;">Hospital Size:</td><td>${Hospital_Size}</td></tr>
                    </table>
                    <p style="font-size: 14px; color: #333; margin-top: 20px;">
                        If you have any questions, feel free to reply to this email.
                    </p>
                    <div style="margin-top: 20px; text-align: center;">
                        <a href="https://medicare-demo.com" style="display: inline-block; padding: 10px 20px; background: #2E86C1; color: #fff; text-decoration: none; border-radius: 4px; font-size: 14px;">Visit Medicare</a>
                    </div>
                    <p style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">
                        © ${new Date().getFullYear()} Medicare. All rights reserved.
                    </p>
                </div>
            `
        };

        // Send Email
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${Work_Email}`);

        return res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Failed to send email", error });
    }
});


// Start Server

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
