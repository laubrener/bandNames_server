const { io } = require('../index');
const Bands = require('../models/bands');
const Band = require('../models/band');

const bands = new Bands();

bands.addBand(new Band("Taylor Swift"));
bands.addBand(new Band("The Beatles"));
bands.addBand(new Band("Queen"));
bands.addBand(new Band("Lady Gaga"));

console.log(bands);

// mensajes de sockets
io.on("connection", client => {
    console.log("cliente conectado");

    client.emit("active-bands", bands.getBands());

    client.on("disconnect", () => {
        console.log("cliente desconectado");
    });
    client.on("mensaje", (payload) => {
        console.log("Mensaje", payload);

        io.emit("mensaje", {admin: "nuevo mensaje"});
    });
    client.on("nuevo-mensaje", (payload) => {
        client.broadcast.emit("nuevo-mensaje", payload);
    });
    client.on("vote-band", (payload) => {
        bands.voteBand(payload.id);
        io.emit("active-bands", bands.getBands());
    });
    client.on("add-band", (payload) => {
        const newBand = new Band(payload.name);
        bands.addBand(newBand);
        io.emit("active-bands", bands.getBands());
    });
    client.on("delete-band", (payload) => {
        bands.deleteBand(payload.id);
        io.emit("active-bands", bands.getBands());
    });
});