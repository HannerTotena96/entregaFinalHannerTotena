// seed.js
const mongoose = require("mongoose");
const Product = require("./models/Products"); // Asegúrate que la ruta sea correcta

mongoose.connect("mongodb+srv://hatotenap:admin123@cluster0.pgo8jci.mongodb.net/labstore", {
  
})
.then(() => console.log("✅ Conectado a MongoDB"))
.catch(err => console.error("❌ Error de conexión:", err));

// Datos de productos (21 productos)
const products = [
  {
    title: "Tamiz 200 mesh",
    description: "Tamiz para granulometría",
    price: 120000,
    code: "TAM-200",
    status: true,
    stock: 25,
    category: "Equipos",
    thumbnails: ["images/tamiz.jpg"]
  },
  {
    title: "Reactivo Xantato PAX",
    description: "Colector para flotación de sulfuros",
    price: 58000,
    code: "PAX-01",
    status: true,
    stock: 40,
    category: "Reactivos",
    thumbnails: ["images/pax.jpg"]
  },
  {
    title: "Micropipeta 1000 µL",
    description: "Instrumento de medición precisa de líquidos",
    price: 95000,
    code: "MICRO-1ML",
    status: true,
    stock: 15,
    category: "Instrumentos",
    thumbnails: ["images/micropipeta.jpg"]
  },
  {
    title: "Probeta Graduada 250 mL",
    description: "Recipiente medidor cilíndrico para líquidos",
    price: 32000,
    code: "PROB-250",
    status: true,
    stock: 35,
    category: "Instrumentos",
    thumbnails: ["images/probeta.jpg"]
  },
  {
    title: "Tubo de Ensayo 16x150 mm",
    description: "Vidrio resistente para pruebas químicas",
    price: 1500,
    code: "TUBO-16150",
    status: true,
    stock: 200,
    category: "Instrumentos",
    thumbnails: ["images/tubo.jpg"]
  },
  {
    title: "Agitador Magnético",
    description: "Equipo para agitación de soluciones",
    price: 230000,
    code: "AGI-MAG",
    status: true,
    stock: 10,
    category: "Equipos",
    thumbnails: ["images/agitador.jpg"]
  },
  {
    title: "Balanza Analítica 0.0001g",
    description: "Alta precisión para pesaje en laboratorio",
    price: 780000,
    code: "BAL-0001",
    status: true,
    stock: 5,
    category: "Equipos",
    thumbnails: ["images/balanza.jpg"]
  },
  {
    title: "pH-metro Digital",
    description: "Medidor digital de pH para soluciones",
    price: 165000,
    code: "PH-DIGI",
    status: true,
    stock: 12,
    category: "Equipos",
    thumbnails: ["images/phmetro.jpg"]
  },
  {
    title: "Beaker 500 mL",
    description: "Vaso de precipitados resistente al calor",
    price: 8500,
    code: "BEAKER500",
    status: true,
    stock: 50,
    category: "Instrumentos",
    thumbnails: ["images/beaker.jpg"]
  },
  {
    title: "Termómetro de Alcohol",
    description: "Medición de temperatura en laboratorio",
    price: 18000,
    code: "TERM-ALC",
    status: true,
    stock: 30,
    category: "Instrumentos",
    thumbnails: ["images/termometro.jpg"]
  },
  {
    title: "Placa calefactora",
    description: "Equipo para calentar muestras en laboratorio",
    code: "PLAC-CA",
    price: 210000,
    stock: 8,
    status: true,
    category: "Equipos",
    thumbnails: ["images/placa.jpg"]
  },
  {
    title: "Embudo de Vidrio",
    description: "Ideal para transferir líquidos en laboratorio",
    price: 4500,
    code: "EMB-VID",
    status: true,
    stock: 60,
    category: "Instrumentos",
    thumbnails: ["images/embudo.jpg"]
  },
  {
    title: "Mufla de Laboratorio",
    description: "Horno de alta temperatura para calcinación de muestras",
    price: 1200000,
    code: "MUFLA-01",
    status: true,
    stock: 3,
    category: "Equipos",
    thumbnails: ["images/mufla.jpg"]
  },
  {
    title: "Papel pH Universal",
    description: "Indicador visual del pH con escala de colores",
    price: 12000,
    code: "PAP-PH",
    status: true,
    stock: 100,
    category: "Reactivos",
    thumbnails: ["images/papelph.jpg"]
  },
  {
    title: "Desecador de Vidrio",
    description: "Conserva muestras en ambiente seco",
    price: 95000,
    code: "DESEC-VID",
    status: true,
    stock: 10,
    category: "Equipos",
    thumbnails: ["images/desecador.jpg"]
  },
  {
    title: "Pipeta Graduada 10 mL",
    description: "Medición exacta de volúmenes pequeños",
    price: 6500,
    code: "PIP-G10",
    status: true,
    stock: 80,
    category: "Instrumentos",
    thumbnails: ["images/pipeta.jpg"]
  },
  {
    title: "Rejilla para Bunsen",
    description: "Soporte metálico para recipientes durante calentamiento",
    price: 8500,
    code: "REJ-BUN",
    status: true,
    stock: 40,
    category: "Instrumentos",
    thumbnails: ["images/rejilla.jpg"]
  },
  {
    title: "Frasco Lavador 500 mL",
    description: "Recipiente para enjuague con agua destilada",
    price: 10000,
    code: "FRAS-LAV",
    status: true,
    stock: 45,
    category: "Instrumentos",
    thumbnails: ["images/lavador.jpg"]
  },
  {
    title: "Guantes de Nitrilo Talla M",
    description: "Protección para manejo de sustancias químicas",
    price: 28000,
    code: "GUA-NIT-M",
    status: true,
    stock: 70,
    category: "Equipos",
    thumbnails: ["images/guantes.jpg"]
  },
  {
    title: "Silicato de Sodio",
    description: "Reactivo espumante para flotación de minerales",
    price: 39000,
    code: "SILI-SOD",
    status: true,
    stock: 25,
    category: "Reactivos",
    thumbnails: ["images/silicato.jpg"]
  },
  {
    title: "Vidrio de Reloj 100 mm",
    description: "Superficie cóncava para evaporación o cobertura",
    price: 2200,
    code: "VID-REL100",
    status: true,
    stock: 100,
    category: "Instrumentos",
    thumbnails: ["images/vidrior.jpg"]
  }
];

// Insertar en la base de datos
const seedDB = async () => {
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log("🌱 Productos insertados correctamente");
  mongoose.connection.close();
};

seedDB();
