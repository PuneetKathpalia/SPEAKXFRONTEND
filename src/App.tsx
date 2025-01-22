import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "./components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { Card, CardHeader, CardContent } from "./components/ui/card";
import { Badge } from "./components/ui/badge";

const SearchWithPagination = () => {
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    fetchQuestions();
  }, [page, search, limit]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get("http://localhost:5555/api/questions", {
        params: { page, limit, search },
      });
      setQuestions(response.data.questions || []);
      setTotalPages(response.data.total);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleLimitChange = (value: any) => {
    setLimit(Number(value));
    setPage(1);
  };

  const highlightText = (text) => {
    if (!search) return text;

    const regex = new RegExp(`(${search})`, "gi");
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={index} className="bg-gray-200 px-1 rounded text-black">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="p-6 min-h-screen bg-black text-white space-y-6">
      {/* Search and Filters */}
      <Card className="p-4 bg-gray-800 shadow-lg">
        <CardHeader>
          <h2 className="text-lg font-semibold text-white">Search Questions</h2>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 items-center">
          <Input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={handleSearchChange}
            className="w-full sm:flex-1 bg-gray-900 text-white border-gray-700 focus:ring-blue-500"
          />
          <Select value={limit.toString()} onValueChange={handleLimitChange}>
            <SelectTrigger className="w-28 bg-gray-900 text-white border-gray-700 focus:ring-blue-500">
              {limit} per page
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white">
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table for Data */}
      <Card className="p-4 bg-gray-900 shadow-md">
        <CardHeader>
          <h2 className="text-lg font-semibold text-white">
            Questions List
          </h2>
        </CardHeader>
        <CardContent>
          <Table className="w-full text-left border-collapse">
            <TableHeader>
              <TableRow className="bg-gray-800 text-white">
                <TableHead className="py-3">Title</TableHead>
                <TableHead className="py-3">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.length > 0 ? (
                questions.map((q, index) => (
                  <TableRow
                    key={index}
                    className={`hover:bg-gray-700 ${q.type === "easy"
                      ? "bg-gray-100 text-black"
                      : q.type === "medium"
                        ? "bg-gray-200 text-black"
                        : "bg-gray-300 text-black"
                      }`}
                  >
                    <TableCell>{highlightText(q.title)}</TableCell>
                    <TableCell>
                      <Badge
                        className={`${q.type === "easy"
                          ? "bg-gray-100 text-gray-800"
                          : q.type === "medium"
                            ? "bg-gray-200 text-gray-800"
                            : "bg-gray-300 text-gray-800"
                          } shadow-md`}
                      >
                        {q.type}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-4">
                    No questions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <Button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Previous
        </Button>
        <span className="text-gray-400">
          Page {page} of {Math.ceil(totalPages / limit)}
        </span>
        <Button
          disabled={page === Math.ceil(totalPages / limit)}
          onClick={() => setPage(page + 1)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default SearchWithPagination;
