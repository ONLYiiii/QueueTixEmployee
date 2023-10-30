import getURL from "../getURL";
import type { Dispatch, SetStateAction } from "react";

type ticketDetailType =
    | {
          email: string;
          type: string;
          priceType: string;
          date_of_use: string;
          entrance_status: number | null;
          updated_at: string | null;
      }
    | undefined;

type StateSetter<T> = Dispatch<SetStateAction<T>>;

function ticketDetails(
    data: string,
    setMessageFail: StateSetter<string>,
    setShowModal: StateSetter<boolean>,
    setFetchData: StateSetter<ticketDetailType>,
    setHasScanned?: StateSetter<boolean>
): void {
    if (setHasScanned !== undefined) {
        setHasScanned(true);
    }
    try {
        fetch(getURL() + "send_TicketDetail?data=" + data)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    if (response.status === 404) {
                        setMessageFail("ไม่พบบัตรผ่านนี้ในระบบ");
                    } else {
                        setMessageFail("เกิดข้อผิดพลาด");
                    }
                    return undefined;
                }
            })
            .then((data) => {
                if (data !== "undefined") {
                    setFetchData(data);
                }
            });
    } catch (error) {
        console.log(error);
        setMessageFail("เกิดข้อผิดพลาด");
    } finally {
        setShowModal(true);
    }
}

export default ticketDetails;
