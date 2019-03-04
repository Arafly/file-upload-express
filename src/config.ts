import * as multer from 'multer'
import * as cors from 'cors'
import * as fs from 'fs'
import * as path from 'path'
import * as Loki from 'lokijs'
import { loadCollection, imageFilter } from './utils'

// Load LokiJs Collection
const DB_NAME = 'db.json';
const COLLLECTION_NAME = 'images';
const UPLOAD_PATH = 'uploads';
// const upload = multer({ dest: `${UPLOAD_PATH}` });
const upload = multer({ dest: `${UPLOAD_PATH}/`, fileFilter: imageFilter }); 
const db = new Loki(`${UPLOAD_PATH}/${DB_NAME}`, { persistenceMethod: "fs" });

export { DB_NAME, COLLLECTION_NAME, UPLOAD_PATH, upload, db}