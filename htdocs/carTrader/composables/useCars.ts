import cars from "@/sample-data/cars.json";
export default function useCarsData() {
  const getCars = () => {
    return cars;
  };
  return { getCars };
}
