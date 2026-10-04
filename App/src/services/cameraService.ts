import { launchCamera } from "react-native-image-picker";

export async function captureImage(): Promise<string | null> {
    try{
        const result = await launchCamera({
            mediaType: 'photo',
        })
        if(result.didCancel){
            return null;
        } else if(result.errorCode) {
            throw new Error(`Camera error: ${result.errorMessage}`);
        } else {
            return result.assets?.[0]?.uri ?? null;
        }
    } catch (error) {
        console.error('Error capturing image:', error);
        throw error;
    }
    
}