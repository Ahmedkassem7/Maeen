import { useState, useCallback } from "react";
import useTeachersStore from "../../stores/FreelanceStore";

export const useTeacherDetails = (teacherId) => {
  const { fetchTeacherDetails } = useTeachersStore();

  const [showModal, setShowModal] = useState(false);
  const [teacherDetails, setTeacherDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  const handleViewDetails = useCallback(
    async (id) => {
      const targetId = id || teacherId;
      if (!targetId) {
        throw new Error("معرف المعلم مطلوب");
      }

      setDetailsError(null);
      setIsLoadingDetails(true);

      try {
        const details = await fetchTeacherDetails(targetId);
        setTeacherDetails(details);
        setShowModal(true);
        return true;
      } catch (error) {
        setDetailsError(error?.message || "حدث خطأ أثناء جلب تفاصيل المعلم");
        throw error;
      } finally {
        setIsLoadingDetails(false);
      }
    },
    [fetchTeacherDetails, teacherId]
  );

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setTeacherDetails(null);
    setDetailsError(null);
  }, []);

  const retryFetchDetails = useCallback(
    (id) => {
      return handleViewDetails(id || teacherId);
    },
    [handleViewDetails, teacherId]
  );

  const clearLocalError = useCallback(() => {
    setDetailsError(null);
  }, []);

  return {
    // State
    teacherDetails,
    isLoadingDetails,
    detailsError,
    showModal,

    // Actions
    handleViewDetails,
    handleCloseModal,
    retryFetchDetails,
    setShowModal,
    clearLocalError,
  };
};

export default useTeacherDetails;
