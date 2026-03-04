import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import { toast } from "react-hot-toast";

export function useCheckout() {
  const queryClient = useQueryClient();

  const { mutate: checkout, isLoading: isCheckingOut } = useMutation({
    mutationFn: (bookingId) =>
      updateBooking(bookingId, {
        status: "checked-out",
      }),

    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully checked out`);
      queryClient.invalidateQueries({ active: true });
    },
    // active 是 React Query 官方自带 的一个过滤配置项。
    // 这行代码的作用是立即刷新当前页面正在使用的所有数据 。

    onError: () => toast.error("There was an error while checking out"),
  });

  return { checkout, isCheckingOut };
}
