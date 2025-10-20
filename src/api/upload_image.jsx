export async function uploadImage() {
    const uploadResult = await cloudinary.uploader

    .upload(
        'https://res.cloudinary.com/dmi0txtoy/image/upload/v1760994299/900d15ce-9289-4df7-806d-50e121260bf2-profile_image-300x300_jjoyeu.png',{
            public_id: 'id_techcol',
        }
    )
    .catch((error) =>{
        console.log(error);
    });

    console.log(uploadResult);

    // Optimize delivery by resizing and applying auto-format and auto quality
    const optimizeUrl = cloudinary.url('id_techcol', {
        fetch_format: 'auto',
        quality: 'auto'
    });

    console.log(optimizeUrl);

    const autoCropUrl = cloudinary.url('id_techcol', {
        crop: 'auto',
        gravity: 'auto',
        width: 500,
        height: 500
    })

    console.log(autoCropUrl)
}