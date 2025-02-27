import axios from "axios";

const getUser = async () => {
  const url = `${import.meta.env.VITE_ROOT_URL}/auth/verify`;
  try {
    const response = await axios.get(url, {
      withCredentials: true,
    });
    const data = response.data;
    sessionStorage.setItem(
      "user",
      JSON.stringify({
        email: data.user.email,
        name: data.user.fullName,
        id: data.user.id,
      })
    );
    return data.user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default getUser;
