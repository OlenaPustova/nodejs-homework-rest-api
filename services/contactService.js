const { Contact } = require('../models/contactModel');

const getListContacts = async (owner) => {
  const contacts = await Contact.find({ owner });
  return contacts;
};

const getContactById = async (contactId, owner) => {
  const contact = await Contact.findById({ _id: contactId, owner });
  return contact;
};

const addContact = async ({ name, email, phone, favorite }, owner) => {
  const contact = await new Contact({ name, email, phone, favorite, owner });
  await contact.save();
  return contact;
};

const removeContact = async (contactId, owner) => {
  await Contact.findByIdAndRemove({ _id: contactId, owner });
};

const updateContact = async (
  contactId,
  { name, email, phone, favorite },
  owner
) => {
  return await Contact.findByIdAndUpdate(
    { _id: contactId, owner },
    {
      $set: { name, email, phone, favorite },
    }
  );
};

const updateStatusContact = async (contactId, { favorite }, owner) => {
  return await Contact.findByIdAndUpdate(
    { _id: contactId, owner },
    {
      $set: { favorite },
    }
  );
};

module.exports = {
  getListContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
