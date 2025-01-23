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

// Define the type for a question
type Question = {
  title: string;
  type: "easy" | "medium" | "hard";
};

// Component
const SearchWithPagination = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  useEffect(() => {
    fetchQuestions();
  }, [page, search, limit]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get("http://localhost:5555/api/questions", {
        params: { page, limit, search },
      });
      setQuestions(response.data.questions || []);
      setTotalPages(response.data.total || 0);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleLimitChange = (value: string) => {
    setLimit(Number(value));
    setPage(1);
  };

  const highlightText = (text: string) => {
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

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div
      className={`p-6 min-h-screen transition-all ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Toggle Button */}
      <div className="flex justify-end mb-4">
        <Button
          onClick={toggleTheme}
          className={`${
            isDarkMode
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-gray-200 text-black hover:bg-gray-300"
          }`}
        >
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </Button>
      </div>
      <Card
        className={`p-4 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
        } shadow-lg`}
      >
        <CardHeader>
          <h2 className="text-lg font-semibold">Search Questions</h2>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 items-center">
          <Input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={handleSearchChange}
            className={`w-full sm:flex-1 ${
              isDarkMode
                ? "bg-gray-900 text-white border-gray-700 focus:ring-blue-500"
                : "bg-white text-black border-gray-300 focus:ring-blue-500"
            }`}
          />
          <Select value={limit.toString()} onValueChange={handleLimitChange}>
            <SelectTrigger
              className={`w-28 ${
                isDarkMode
                  ? "bg-gray-900 text-white border-gray-700 focus:ring-blue-500"
                  : "bg-white text-black border-gray-300 focus:ring-blue-500"
              }`}
            >
              {limit} per page
            </SelectTrigger>
            <SelectContent
              className={isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100"}
            >
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <Card
        className={`p-4 ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
        } shadow-md`}
      >
        <CardHeader>
          <h2 className="text-lg font-semibold">Questions List</h2>
        </CardHeader>
        <CardContent>
          <Table className="w-full text-left border-collapse">
            <TableHeader>
              <TableRow
                className={
                  isDarkMode
                    ? "bg-gray-800 text-white"
                    : "bg-gray-300 text-black"
                }
              >
                <TableHead className="py-3">Title</TableHead>
                <TableHead className="py-3">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.length > 0 ? (
                questions.map((q, index) => (
                  <TableRow
                    key={index}
                    className={`hover:${
                      isDarkMode
                        ? "bg-gray-700 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    <TableCell>{highlightText(q.title)}</TableCell>
                    <TableCell>
                      <Badge
                        className={`${
                          q.type === "easy"
                            ? isDarkMode
                              ? "bg-gray-100 text-gray-800"
                              : "bg-blue-100 text-blue-800"
                            : q.type === "medium"
                            ? isDarkMode
                              ? "bg-gray-200 text-gray-800"
                              : "bg-yellow-100 text-yellow-800"
                            : isDarkMode
                            ? "bg-gray-300 text-gray-800"
                            : "bg-red-100 text-red-800"
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
        <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
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
