const bcrypt = require("bcryptjs");

const hashPassword = async () => {
    const password = "admin"; // Set your desired admin password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword);
};

hashPassword();

// {
//     "firstName": "Akash",
//     "lastName": "D",
//     "email": "22501a0537@pvpsit.ac.in",
//     "password": "$2a$10$NiVDEAo5kwa.lGAE689.l.Jv5lU/sEPnpyue4DYd7qKcelba6brJW",
//     "role": "Admin",
//     "profileImage": "",
//     "assignedProjects": []
// }
