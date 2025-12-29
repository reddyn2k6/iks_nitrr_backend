import People from "../model/people.js";
import cloudinary from "../config/cloudinary.js";
const uploadImage = async (file) => {
  if (!file) {
    throw new Error("No image provided");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "service-images" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url); // only link
      }
    );

    uploadStream.end(file.buffer);
  });
};

export const addPerson = async (req, res) => {
  try {
    const { name, role, email, alternateEmail } = req.body;

    if (!name || !role || !email) {
      return res.status(400).json({
        success: false,
        msg: "Name, role and email are required"
      });
    }

    const photo = await uploadImage(req.file);

    const people = await People.create({
      name,
      role,
      email,
      photo,
      alternateEmail
    });

    return res.status(201).json({
      success: true,
      msg: "Person added successfully",
      data: people
    });

  } catch (error) {
    console.error("Error adding person:", error);
    res.status(500).json({
      success: false,
      msg: error
    });
  }
};


export const getAllPeople = async (req, res) => {
  try {
    const Allpeople = await People.find({});

    return res.status(200).json({
      success: true,
      data: Allpeople
    });
  } catch (error) {
    console.error("Error Getting People:", error);
    res.status(500).json({
      success: false,
      msg: "Server error"
    });
  }
};

export const updatePeople = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, email, alternateEmail } = req.body;

    // check if person exists
    const person = await People.findById(id);
    if (!person) {
      return res.status(404).json({
        success: false,
        msg: "Person not found"
      });
    }

    let photo = person.photo;
    if (req.file) {
      photo = await uploadImage(req.file);
    }

    const updatedPerson = await People.findByIdAndUpdate(
      id,
      {
        name,
        role,
        email,
        alternateEmail,
        photo
      },
      {
        new: true,
        runValidators: true
      }
    );

    return res.status(200).json({
      success: true,
      msg: "Person updated successfully",
      data: updatedPerson
    });

  } catch (error) {
    console.error("Error updating person:", error);
    res.status(500).json({
      success: false,
      msg: error.message
    });
  }
};
