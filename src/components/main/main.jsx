import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getAllExam,
  resetExamCommonState,
} from "../../features/exam/exam.slice";
import {
  getAllResult,
  resetResultCommonState,
} from "../../features/result/result.slice";
import { ExamListDetails } from "../exam/exam-list";

const Main = () => {
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { exams, isError, message, isSuccess } = useSelector(
    (state) => state.exam
  );
  const {
    results,
    isError: isResultError,
    message: resultMessage,
    isSuccess: isResultSuccess,
  } = useSelector((state) => state.result);
  const dispatch = useDispatch();

  const [uniqueAttempts, setUniqueAttempts] = useState(0);
  const [uniqueUsers, setUniqueUsers] = useState(0);

  useEffect(() => {
    const filtered = exams.filter((exam) =>
      exam.exam_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setRows(filtered);
  }, [exams, searchTerm]);

  useEffect(() => {
    if (isSuccess) setRows(exams);

    return () => dispatch(resetExamCommonState());
  }, [dispatch, isSuccess, exams]);

  useEffect(() => {
    if (isError) toast.error(message);

    return () => dispatch(resetExamCommonState());
  }, [dispatch, isError, message]);

  const getUniqueData = useCallback(() => {
    if (!results?.length) return;

    const uniqueAttemptsData = {};
    const uniqueUsersData = {};

    results.forEach((r) => {
      if (!uniqueAttemptsData[r.exam_id]) uniqueAttemptsData[r.exam_id] = {};
      if (!uniqueAttemptsData[r.exam_id][r.attempt_id])
        uniqueAttemptsData[r.exam_id][r.attempt_id] = 1;

      if (!uniqueUsersData[r.exam_id]) uniqueUsersData[r.exam_id] = {};
      if (!uniqueUsersData[r.exam_id][r.candidate_id])
        uniqueUsersData[r.exam_id][r.candidate_id] = 1;
    });

    setUniqueAttempts(uniqueAttemptsData);
    setUniqueUsers(uniqueUsersData);
  }, [results]);

  useEffect(() => {
    if (isResultSuccess) {
      getUniqueData();
    }

    return () => dispatch(resetResultCommonState());
  }, [dispatch, getUniqueData, isResultSuccess]);

  useEffect(() => {
    if (isResultError) toast.error(resultMessage);

    return () => dispatch(resetResultCommonState());
  }, [dispatch, isResultError, resultMessage]);

  useEffect(() => {
    dispatch(getAllResult());

    return () => dispatch(resetResultCommonState());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllExam());

    return () => dispatch(resetExamCommonState());
  }, [dispatch]);

  return (
    <ExamListDetails
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      rows={rows}
      uniqueAttempts={uniqueAttempts}
      uniqueUsers={uniqueUsers}
    />
  );
};

export default Main;
