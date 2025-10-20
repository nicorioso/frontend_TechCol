import { v2 as cloudinary } from 'cloudinary';
import { uploadImage } from './upload_image';


(async function() {
    //Configuration

    cloudinary.config({
        cloud_name: 'dmi0txtoy',
        api_key: '836738648561445',
        api_secret: '**********'
    });

    // Upload image
    <uploadImage/>
    
})