import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createBus,
  deleteBus,
  findBusRoutes,
  type GetBusesParams,
  getBuses,
  updateBus,
} from "@/actions/bus.action";
import { queryKeys } from "@/lib/queryKeys";
import { type CreateBusInput } from "@/validators/buses";

export function useFindBusRoutes(
  departureStopId: string,
  destinationStopId: string,
) {
  return useQuery({
    queryKey: [queryKeys.busRoutes, departureStopId, destinationStopId],
    queryFn: () => findBusRoutes(departureStopId, destinationStopId),
    enabled: !!departureStopId && !!destinationStopId,
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  });
}

export type UseFindBusRoutesResponse = Awaited<
  ReturnType<typeof findBusRoutes>
>;

export function useFetchBuses(params: GetBusesParams) {
  return useQuery({
    queryKey: ["buses", params],
    queryFn: () => getBuses(params),
  });
}

export function useCreateBus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buses"] });
      toast.success("Bus created successfully");
    },
    onError: (error: { message: string }) => toast.error(error.message),
  });
}

export function useUpdateBus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateBusInput }) =>
      updateBus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buses"] });
      toast.success("Bus updated successfully");
    },
    onError: (error: { message: string }) => toast.error(error.message),
  });
}

export function useDeleteBus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buses"] });
      toast.success("Bus deleted");
    },
    onError: (error: { message: string }) => toast.error(error.message),
  });
}
