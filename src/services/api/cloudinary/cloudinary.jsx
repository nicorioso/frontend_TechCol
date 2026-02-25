import { v2 as cloudinary } from 'cloudinary';

(async function cloudinaryConfig() {
    cloudinary.config({
        cloud_name: 'dmi0txtoy',
        api_key: '836738648561445',
        api_secret: '**********'
    });

});

export default cloudinaryConfig;