import * as del from 'del';
import * as Loki from 'lokijs';

const loadCollection = function (colName, db: Loki): Promise< Collection<any> > {
    return new Promise(resolve => {
        db.loadDatabase({}, () => {
            const _collection = db.getCollection(colName) || db.addCollection(colName);
            resolve(_collection);
        })
    });
}


// Filter to accept only iamges 
const imageFilter = function (req, file, cb) {
    // accept image only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
}

const cleanFolder = function (folderPath) {
    // delete files inside folder but not the folder itself
    del.sync([`${folderPath}/**`, `!${folderPath}`])
}

export { loadCollection, imageFilter, cleanFolder }
