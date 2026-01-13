import { createContext, useContext } from "react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const calculateAge = (dob) => {
    const today = new Date();
    const birthday = new Date(dob);
    const age = today.getFullYear() - birthday.getFullYear();
    return age;
  };

   const currencySymbol = "$";
  const slotDateformatted = (dateStr) => {
    const month = [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const dateArray = dateStr.split("_");
    return (
      dateArray[0] + " " + month[Number(dateArray[1])] + " " + dateArray[2]
    );
  };



  
  const value = { calculateAge,slotDateformatted,currencySymbol };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
