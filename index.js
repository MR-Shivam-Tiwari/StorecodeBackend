const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const app = express();
const PORT = 3002;


const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept',
};

app.use(cors(corsOptions));


app.use(bodyParser.json());

const items = [];
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


// New route to generate a code from a product link
app.post("/api/generate", async (req, res) => {
  const { link } = req.body;

  if (!link) {
    return res.status(400).json({ error: "Link is required" });
  }

  try {
    const { nanoid } = await import("nanoid");
    const code = nanoid(5);
    items.push({ code, link });
    res.json({ code, link });
  } catch (error) {
    console.error("Error generating code:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post('/api/generate-link', (req, res) => {
  const { code } = req.body;
  const item = items.find((item) => item.code === code);

  if (item) {
    res.json({ link: item.link });
  } else {
    res.status(404).json({ error: 'Code not found' });
  }
});


// New route to handle redirection based on the generated code
// app.get('/api/redirect-image/:code', async (req, res) => {
//   const { code } = req.params;
//   const item = items.find((item) => item.code === code);

//   if (item) {
//     try {
//       const response = await axios.get(item.link, {
//         responseType: 'arraybuffer',
//       });

//       const contentType = response.headers['content-type'];
//       res.set('Content-Type', contentType);
//       res.send(Buffer.from(response.data, 'binary'));
//     } catch (error) {
//       console.error('Error fetching image:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   } else {
//     res.status(404).json({ error: 'Code not found' });
//   }
// });



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
