const fs = require('fs');
const pdf = require('html-pdf');
const md5 = require('md5');
const UserKYC = require('../models/UserKYC');
const router = require('express').Router();

router.get('/', async (req, res) => {
  try {
    const userkyc = await UserKYC.find();
    res.status(200).json({ success: true, data: userkyc });
  } catch (err) {
    res.status(400).json({ success: false, msg: 'Server Error' });
  }
});

router.post('/', (req, res) => {
  pdf.create(htmlGenerator(req.body)).toBuffer(async function (err, buffer) {
    console.log(buffer);
    if (err) {
      res.status(400).json({ success: false, msg: 'Error in creating pdf' });
    }

    try {
      const pdfname = md5(JSON.stringify(req.body));
      const url = `${req.protocol}://${req.get('host')}/uploads/${pdfname}.pdf`;
      await fs.writeFileSync(`./uploads/${pdfname}.pdf`, buffer, 'binary');
      const formData = new UserKYC({
        ...req.body,
        isApproved: false,
        docUrl: url
      });
      formData.save((err, response) => {
        if (err) {
          res.status(400).json({ success: false, msg: 'Error in saving doc' });
        } else {
          res.status(200).json({
            success: true,
            msg: 'Details Saved',
            data: response
          });
        }
      });
    } catch (err) {
      res.status(400).json({ success: false, msg: 'Error in uploading' });
    }
  });
});

function htmlGenerator(userData) {
  return `<div>
    <h1 style="color: #4338CA; text-align:center">USER KYC</h1>
    <div style="display: flex;justify-content: 'space-between'">
    <p><b>Name:</b> ${userData.name}</p>
    <div>
    <p><b>Age:</b> ${userData.age}</p>
    <p><b>Gender:</b> ${userData.gender}</p>
    </div>
    </div>
    <div>
    <p><b>Adhaar:</b> ${userData.adhaar}</p>
    <p><b>Pan:</b> ${userData.pan}</p>
    </div>
    </div>`;
}

module.exports = router;
