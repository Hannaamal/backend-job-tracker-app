import Company from "../../models/company.js"


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

    const company = await Company.create({
      ...req.body,
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
     const companies = await Company.find({ is_deleted: { $ne: true } }).populate("createdBy", "name email");
    res.status(200).json(companies);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch companies", error: err.message });
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
      return res.status(403).json({ message: "Forbidden: Only admin can delete companies" });
    }

    const companyId = req.params.id;
    const company = await Company.findById(companyId);

    if (!company || company.is_deleted) {
      return res.status(404).json({ message: "Company not found" });
    }

    company.is_deleted = true;
    await company.save();

    res.status(200).json({ message: "Company deleted successfully (soft delete)" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete company", error: err.message });
  }
};









