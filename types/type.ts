// export type Destination = {
//   id?: string | number;
//   _id?: string;
//   title?: string;
//   name?: string;
//   location?: string;
//   country?: string;
//   category?: string;
//   image?: string;
//   imageUrl?: string;
//   price: string | number;
//   duration?: string;
//   rating?: number;
//   description?: string;
// };


export interface Destination {
  id: string;
  _id: string;
  name: string;
  country: string;
  category: string;
  price: string | number;
  duration: string;
  departureDate: string;
  imageUrl: string;
  description: string;
}


export type ApiResponse = Destination[] | { data: Destination[] };