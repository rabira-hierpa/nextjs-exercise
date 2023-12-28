"use client";

import { IData } from "@/utils/types";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/getData")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  const sortByParam = (param: string) => {
    fetch("/api/getData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sortBy: param }),
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  };

  return (
    <div className="m-10 ">
      <div className="flex p-2 justify-between">
        <div className="mx-auto text-2xl font-semibold flex items-center">
          Item list
        </div>
        <div className="flex items-center gap-2 max-w-5xl mt-5">
          <div>Sort By</div>
          <button
            className="rounded border-2 text-blue-600 p-2"
            onClick={() => sortByParam("name")}
          >
            Name
          </button>
          <button
            className="rounded border-2 text-blue-600 p-2"
            onClick={() => sortByParam("date")}
          >
            Date
          </button>
        </div>
      </div>
      {!data.length && <div>No list to display!</div>}
      <div>
        {data.map((item: IData) => {
          return (
            <div key={item.id} className="flex justify-center space-x-10">
              <p className="text-xl font-semibold">{item.file_name}</p>
              <p className="text-xl font-semibold">
                {new Date(item.date).toLocaleDateString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
