import axios from "axios";

async function getCoordinates(address: string): Promise<any> {
    try {
        const response = await axios.get(
            'http://api.positionstack.com/v1/forward',
            {
                params: {
                    access_key: '457fea3a5240f2f1b30680dc75ef5fca',
                    query: address,
                    country: "BR",
                },
            }
        );
        return [response.data.data[0].latitude, response.data.data[0].longitude];
        } catch (error) {
        console.error(error);
    }
}

export default getCoordinates;