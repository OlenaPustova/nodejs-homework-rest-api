const {
  getListContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require('../services/contactService');

const getContactsController = async (req, res) => {
  const { _id: owner } = req.user;

  const contacts = await getListContacts(owner);
  res.status(200).json(contacts);
};

const getContactByIdController = async (req, res) => {
  const { _id: owner } = req.user;
  const { id: contactId } = req.params;

  const contact = await getContactById(contactId, owner);
  if (!contact) {
    return res
      .status(404)
      .json({ message: `Not found contact with id '${contactId}'` });
  }
  res.status(200).json({ contact });
};

const addContactController = async (req, res) => {
  const { _id: owner } = req.user;

  const contact = await addContact(req.body, owner);
  res.status(201).json({ contact });
};

const removeContactController = async (req, res) => {
  const { _id: owner } = req.user;
  const { contactId } = req.params;

  const contact = await getContactById(contactId, owner);
  if (!contact) {
    return res
      .status(404)
      .json({ message: `Not found contact with id '${contactId}'` });
  }
  await removeContact(contactId);
  res.status(200).json({ message: 'contact deleted' });
};

const updateContactController = async (req, res) => {
  const { _id: owner } = req.user;
  const { contactId } = req.params;

  const contact = await getContactById(contactId, owner);
  if (!contact) {
    return res
      .status(404)
      .json({ message: `Not found contact with id '${contactId}'` });
  }
  const updatedContact = await updateContact(contactId, req.body, owner);

  res.status(200).json({ updatedContact });
};

const updateStatusContactController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) {
    return res
      .status(404)
      .json({ message: `Not found contact with id '${contactId}'` });
  }

  const updatedContact = await updateContact(contactId, req.body);
  res.status(200).json({ updatedContact });
};

module.exports = {
  getContactsController,
  getContactByIdController,
  addContactController,
  removeContactController,
  updateContactController,
  updateStatusContactController,
};
