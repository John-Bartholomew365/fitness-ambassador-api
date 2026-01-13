function generateTicketId() {
    const prefix = "W2F5-";
    const randomNumber = Math.floor(100000 + Math.random() * 900000); // 6-digit number
    return `${prefix}${randomNumber}`;
}

module.exports = generateTicketId;
