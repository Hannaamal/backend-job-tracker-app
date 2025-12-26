import mongoose from "mongoose";
import Company from "../models/company.js";
import Job from "../models/jobs.js";
import companySubscription from "../models/companySubscription.js";


//CREATE NEW COMPANY

export const createCompany = async (req, res) => {
  try {
    // Only admin can create a company
    if (req.userData.userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden: Only admin can create companies" });
    }

    const { name, location } = req.body;

    // 🔍 Check if company already exists (not deleted)
    const existingCompany = await Company.findOne({
      name: name.trim(),
      location: location.trim(),
      is_deleted: false,
    });

    if (existingCompany) {
      return res.status(409).json({
        message: "Company already exists",
      });
    }
    const logoPath = req.file ? `/uploads/logos/${req.file.filename}` : "/uploads/logos/default-logo.png";

    const company = await Company.create({
      ...req.body,
       logo: logoPath, 
      createdBy: req.userData.userId,
      is_deleted: false,
    });

    res.status(201).json({
      message: "Company created successfully",
      company,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create company", error: err.message });
  }
};

//    VIEW ALL COMPANIES

export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find({
      is_deleted: { $ne: true },
    }).populate("createdBy", "name email");
    res.status(200).json(companies);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch companies", error: err.message });
  }
};

// GET COMPANY BY ID
// ----------------------------

export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id.trim(); // remove extra spaces

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }

    const company = await Company.findOne({
      _id: new mongoose.Types.ObjectId(companyId),
      is_deleted: false,
    });
    

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const jobs = await Job.find({ company: companyId, is_deleted: false });

    let isSubscribed = false;

    if (req.userData) {
      const sub = await companySubscription.findOne({
        user: req.userData.userId,
        company: companyId,
        is_active: true,
      });
      isSubscribed = !!sub;
    }

    res.status(200).json({
      ...company.toObject(),
      jobs,
      isSubscribed,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



//     EDIT/UPDATE COMPANY
// ----------------------------

export const updateCompany = async (req, res) => {
  try {
    // Only admin can edit company
    if (req.userData.userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden: Only admin can edit companies" });
    }

    const companyId = req.params.id;
    const { name, description, location } = req.body;

    const company = await Company.findOne({
      _id: companyId,
      is_deleted: false,
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Optional: prevent duplicate name + location
    if (name && location) {
      const existingCompany = await Company.findOne({
        _id: { $ne: companyId },
        name: name.trim(),
        location: location.trim(),
        is_deleted: false,
      });

      if (existingCompany) {
        return res.status(409).json({
          message: "Another company with same name and location already exists",
        });
      }
    }

    // Update fields (only if provided)
    if (name) company.name = name.trim();
    if (description !== undefined) company.description = description;
    if (location) company.location = location.trim();

     if (req.file) {
      company.logo = `/uploads/logos/${req.file.filename}`;
    }

    await company.save();

    res.status(200).json({
      message: "Company updated successfully",
      company,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update company",
      error: err.message,
    });
  }
};

// DELETE COMPANY

export const deleteCompany = async (req, res) => {
  try {
    if (req.userData.userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden: Only admin can delete companies" });
    }

    const companyId = req.params.id;
    const company = await Company.findById(companyId);

    if (!company || company.is_deleted) {
      return res.status(404).json({ message: "Company not found" });
    }

    company.is_deleted = true;
    await company.save();

    res
      .status(200)
      .json({ message: "Company deleted successfully (soft delete)" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete company", error: err.message });
  }
};
