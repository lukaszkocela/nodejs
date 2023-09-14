const service = require("../service");
const Joi = require("joi");
const User = require("../service/schemas/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const jimp = require("jimp");
const path = require("path");
require("dotenv").config();

const get = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const results = await service.getAllContacts(userId);
    res.json({
      status: "Success",
      code: 200,
      data: {
        contacts: results,
      },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getById = async (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  try {
    const result = await service.getContactById(id, userId);
    if (result) {
      res.json({
        status: "Success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "Error",
        code: 404,
        message: `Contact with id: ${id} not found`,
        data: "Not Found",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const create = async (req, res, next) => {
  const { name, email, phone } = req.body;
  const { id: userId } = req.user;
  try {
    const result = await service.createContact({ name, email, phone }, userId);

    res.status(201).json({
      status: "Success",
      code: 201,
      data: { contact: result },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const update = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone, favorite } = req.body;
  try {
    const result = await service.updateContact(id, {
      name,
      email,
      phone,
      favorite,
    });
    if (result) {
      res.json({
        status: "Success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "Error",
        code: 404,
        message: `Contact with id: ${id} not found`,
        data: "Not Found",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const updateFavorite = async (req, res, next) => {
  const { id } = req.params;
  const { favorite } = req.body;

  if (favorite === undefined || favorite === null) {
    return res.status(400).json({
      status: "Error",
      code: 400,
      message: "No Favorite",
    });
  }

  try {
    const result = await service.updateStatusContact(id, { favorite });
    if (result) {
      res.json({
        status: "Success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "Error",
        code: 404,
        message: `Contact with id: ${id} not found`,
        data: "Not Found",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const remove = async (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  try {
    const result = await service.removeContact(id, userId);
    if (result) {
      res.json({
        status: "Success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "Error",
        code: 404,
        message: `Contact with id: ${id} not found`,
        data: "Not Found",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const userSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{5,15}$")).required(),
});

const signUp = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { error } = userSchema.validate({ email, password });
    const avatarURL = gravatar.url(email, {
      s: "250",
      r: "pg",
      d: "identicon",
    });

    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(409).json({
        message: "Email in use",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await service.createUser({
      email: email,
      password: hashedPassword,
    });

    return res.status(201).json({
      user: {
        email: result.email,
        subscription: result.subscription,
        avatarURL: avatarURL,
      },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { error } = userSchema.validate({ email, password });

    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    const registeredUser = await User.findOne({ email: email });

    if (!registeredUser) {
      return res.status(401).json({ message: "Wrong email or password" });
    }

    const properPassword = await bcrypt.compare(
      password,
      registeredUser.password
    );

    if (!properPassword) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const payload = {
      id: registeredUser.id,
      email: email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    registeredUser.token = token;
    await registeredUser.save();

    return res.status(200).json({
      token: token,
      user: {
        email: registeredUser.email,
        subscription: registeredUser.subscription,
      },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const logOut = async (req, res, next) => {
  try {
    const user = req.user;

    user.token = null;
    await user.save();

    return res.status(204).json();
  } catch (err) {
    return next(err);
  }
};

const currentUser = (req, res) => {
  try {
    return res.status(200).json({
      email: req.user.email,
      subscription: req.user.subscription,
    });
  } catch (err) {
    return next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const user = req.user;

    const avatarPath = path.join(
      __dirname,
      "..",
      "public",
      "avatars",
      req.file.filename
    );
    const avatar = await jimp.read(req.file.path);
    await avatar.resize(250, 250).write(avatarPath);

    user.avatarURL = `/avatars/${req.file.filename}`;
    await user.save();

    res.status(200).json({ avatarURL: user.avatarURL });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  get,
  getById,
  create,
  update,
  updateFavorite,
  remove,
  signUp,
  logIn,
  logOut,
  currentUser,
  updateAvatar,
};
