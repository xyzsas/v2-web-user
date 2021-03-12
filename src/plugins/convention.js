import Hashes from 'jshashes'

export const md5 = (msg) => new Hashes.MD5().b64(msg).substr(7, 10).replace(/\//g, '_').replace(/\+/g, '-')
export const sha256 = (msg) => new Hashes.SHA256().b64(msg + 'XYZSAS_STATIC_SALT')
