const express = require("express");
const contacts = require("../../models/contacts");
const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const contactsList = await contacts.listContacts();
    res.status(200).json({
      message: "success",
      data: { contactsList },
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const wantedContact = await contacts.getContactById(contactId);

    if (wantedContact) {
      res.status(200).json({
        message: "success",
        data: { wantedContact },
      });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const body = req.body;
    const { error } = contactSchema.validate(body);

    if (error) return res.status(400).send({ message: error.details });

    const addedContact = await contacts.addContact(body);
    res.status(201).json({
      message: "Contact added",
      data: { addedContact },
    });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deletedContact = await contacts.removeContact(contactId);

    deletedContact
      ? res.status(200).json({ message: "Contact deleted" })
      : res.status(404).json({ message: "Not found" });
  } catch (error) {
    console.log(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const body = req.body;
    const { contactId } = req.params;
    const { error } = contactSchema.validate(body);

    if (error) return res.status(400).send({ message: error.details });

    const editedContact = await contacts.updateContact(contactId, body);

    if (editedContact) {
      res.status(200).json({
        message: "Contact edited",
        data: { editedContact },
      });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
