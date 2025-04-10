import { Request } from 'express';
import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';
import { sanitizeFilename } from '../../utils/helpers';

dotenv.config();

// Configurazione per la memorizzazione dei file
const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, name: string) => void | undefined
  ) => {
    // Specifica la cartella dove salvare i file caricati
    const folderName: string =
      process.env.IMAGE_UPLOAD_FOLDER + '/' || 'public/images/';

    const filePath = path.join(__dirname, `../../../${folderName}`);
    cb(null, filePath);
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, name: string) => void | undefined
  ) => {
    // Definisci come nominare i file caricati
    const uniqueSuffix = Date.now().toString();
    const fileExtension = path.extname(file.originalname);
    const fileName = uniqueSuffix + '-' + file.fieldname + fileExtension;
    const fName = sanitizeFilename(fileName);
    cb(null, fName);
  },
});

// Filtro per accettare solo determinati tipi di file (opzionale)
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accetta il file
  } else {
    cb(null, false); // Rifiuta il file
  }
};

// middleware di upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter, // Opzionale: applica il filtro
  // limits: { fileSize: 10 * 1024 * 1024 }, // Opzionale: limita la dimensione del file (es. 10MB)
});

export  {upload};
