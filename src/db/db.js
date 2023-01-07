import fs from 'fs';

const loadUsers = () => {
    try {
        const dataBuffer = fs.readFileSync('./src/db/userData.json');
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch (e) {
        return []
    };
};



const saveUsers = (users) => {
    const data = JSON.stringify(users);
    fs.writeFileSync('./src/db/userData.json', data);
};

export { loadUsers, saveUsers };