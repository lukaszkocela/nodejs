const Contact = require("./schemas/contact");
const User = require("./schemas/user");

const getAllContacts = async (userId) => {
  return Contact.find({ owner: userId });
};

const getContactById = (id, userId) => {
  return Contact.findOne({ _id: id, owner: userId });
};

const createContact = ({ name, email, phone }, userId) => {
  return Contact.create({ name, email, phone }, { owner: userId });
};

const updateContact = (id, fields) => {
  return Contact.findByIdAndUpdate({ _id: id }, fields, { new: true });
};

const updateStatusContact = (id, body) => {
  return Contact.findByIdAndUpdate(id, body);
};

const removeContact = (id, userId) => {
  return Contact.findByIdAndRemove({ _id: id, owner: userId });
};

const createUser = ({ email, password }) => {
  return User.create({ email, password });
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  removeContact,
  updateStatusContact,
  createUser,
};
