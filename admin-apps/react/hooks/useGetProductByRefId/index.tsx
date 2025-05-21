import axios from 'axios';

const useGetProductByRefId = async (refId: string) => {
  try {
    const request = await axios.get(`/api/catalog_system/pvt/products/productgetbyrefid/${refId}`);
    return request.data
  } catch (error) {
    console.error();
    return null
  }
}

export default useGetProductByRefId
