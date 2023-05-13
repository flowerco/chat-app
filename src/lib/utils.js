export const removeArrayItem = (items, index) => {
  return [...items.slice(0, index), ...items.slice(index + 1)];
}

export const debounce = (func, wait=300) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export function capitaliseFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function replaceAtArrayIndex (array, index, value) {
  const ret = array.slice(0);
  ret[index] = value;
  return ret;
}

// export const getUserFromCookie = async (cookies) => {
//   const jwt = cookies.get(process.env.COOKIE_NAME);
//   const { id } = await verify(jwt.value);
  
//   const user = await db.user.findUnique({
//     where: {
//       id
//     }
//   });
//   return user;
// }