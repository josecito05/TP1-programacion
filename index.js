import express from "express";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const readData = () => {
    try {
        const data = fs.readFileSync("./db.json");
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
        return { libros: [] };
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data));
    } catch (error) {
        console.error(error);
    }
};

app.get("/", (req, res) => {
    res.send("bienvenido a mi primera api con node js!");
});

app.get("/libros", (req, res) => {
    const data = readData();
    res.json(data.libros);
});

app.get("/libros/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const libro = data.libros.find((libro) => libro.id === id);
    res.json(libro);
});

app.post("/libros", (req, res) => {
    const data = readData();
    const body = req.body;
    const newLibro = {
        id: data.libros.length + 1,
        ...body,
    };
    data.libros.push(newLibro);
    writeData(data);
    res.json(newLibro);
});

app.put("/libros/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const libroIndex = data.libros.findIndex((libro) => libro.id === id);
    data.libros[libroIndex] = {
        ...data.libros[libroIndex],
        ...body,
    };
    writeData(data);
    res.json({ message: "El libro fue actualizado correctamente" });
});

app.delete("/libros/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const libroIndex = data.libros.findIndex((libro) => libro.id === id);
    data.libros.splice(libroIndex, 1);
    writeData(data);
    res.json({ message: "El libro fue borrado" });
});

app.listen(3000, () => {
    console.log("servidor a la espera del puerto 3000");
});