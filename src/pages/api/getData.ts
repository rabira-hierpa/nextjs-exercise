import { IData } from "@/utils/types";
import csvtojson from "csvtojson";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

const csvFilepath = path.join(process.cwd(), "/src/random_data.csv");

function customLocaleCompare(str1: string, str2: string) {
  if (str1 === str2) {
    return 0; // Strings are equal
  }

  const minLength = Math.min(str1.length, str2.length);

  for (let i = 0; i < minLength; i++) {
    const charCode1 = str1.charCodeAt(i);
    const charCode2 = str2.charCodeAt(i);

    if (charCode1 < charCode2) {
      return -1; // str1 comes before str2
    } else if (charCode1 > charCode2) {
      return 1; // str1 comes after str2
    }
  }

  // Strings are equal up to the length of the shorter string
  return str1.length - str2.length;
}

async function getCSVData() {
  return await csvtojson().fromFile(csvFilepath);
}

async function sortByDate() {
  const jsonFile = await getCSVData();
  const sortedData = jsonFile.toSorted((a: IData, b: IData) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });
  return sortedData;
}

async function sortByName() {
  const jsonFile = await getCSVData();
  const sortedData = jsonFile.toSorted((a: IData, b: IData) => {
    const name1A = a.file_name.split("-")[1];
    const name1B = b.file_name.split("-")[1];
    const numA = parseInt(name1A.split(".")[0]);
    const numB = parseInt(name1B.split(".")[0]);
    if (numA < numB) return -1;
    else if (numA > numB) return 1;
    else return 0;
  });
  return sortedData;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "GET":
        const jsonArray = await getCSVData();
        res.status(200).json(jsonArray);
        break;
      case "POST":
        const sortBy = req.body.sortBy;
        const sortedData =
          sortBy === "date" ? await sortByDate() : await sortByName();
        res.status(200).json(sortedData);
        break;
      default:
        res.status(405).end();
        break;
    }
  } catch (error) {}
}
