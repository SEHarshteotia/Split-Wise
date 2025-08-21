const express = require("express");
const router = express.Router();

const { getAllContacts,GetContact,DeleteContact,CreateContact,UpdateContact} = require('../controller/contactsController')

router.route('/').get(getAllContacts ).post( CreateContact );
router.route('/:id').put(UpdateContact ).delete(DeleteContact ).get(GetContact );

module.exports = router;
