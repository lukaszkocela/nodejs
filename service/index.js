const Contact = require("./schemas/contact");
const User = require("./schemas/user");

const getAllContacts = async () => {
  return Contact.find();
};

const getContactById = (id) => {
  return Contact.findOne({ _id: id });
};

const createContact = ({ name, email, phone }) => {
  return Contact.create({ name, email, phone });
};

const updateContact = (id, fields) => {
  return Contact.findByIdAndUpdate({ _id: id }, fields, { new: true });
};

const updateStatusContact = (id, body) => {
  return Contact.findByIdAndUpdate(id, body);
};

const removeContact = (id) => {
  return Contact.findByIdAndRemove({ _id: id });
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
