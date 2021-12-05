const { updateContact } = require('../controllers/contactsCtrl');
const Contact = require('../repository/contactsModel');

jest.mock('../repository/contactsModel');

describe('Unit test ', () => {
  const req = { user: { id: 1 }, body: {}, params: { id: 1 } };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn((data) => data),
  };
  const next = jest.fn();
  it('update contacts exist', async () => {
    const contact = { contact: { id: 3 } };
    Contact.updateContact = jest.fn(() => {
      return contact;
    });

    const result = await updateContact(req, res, next);
    expect(result.status).toEqual('success');
    expect(result.code).toEqual(201);
    expect(result.data.contact).toEqual(contact);
  });
  it('update contact not exist', async () => {
    Contact.updateContact = jest.fn();
    const result = await updateContact(req, res, next);
    expect(result.message).toEqual('missing fields');
  });
  it('update contact: rep return error', async () => {
    Contact.updateContact = jest.fn(() => {
      throw new Error('Ooops');
    });
    await updateContact(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
