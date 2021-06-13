import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import {
  InternalActionLogger,
  InternalActionLoggerRecord,
  InternalLoggerMeta,
} from "@webcarrot/multi-lan-controller/admin/api/logger/types";
import {
  ItemContent,
  Loader,
  useAdminApiCall,
} from "@webcarrot/multi-lan-controller/admin/components";
import * as React from "react";
import { CSVLine, makeCsvLine } from "./csv";
import { Footer } from "./footer";

const formatToCsv = (items: ReadonlyArray<InternalActionLoggerRecord>) =>
  [["date", "success", "user", "action", "device", "place"] as CSVLine]
    .concat(
      items.map<CSVLine>(({ date, user, action, device, place, success }) => [
        new Date(date).toISOString(),
        success ? "yes" : "no",
        user,
        action,
        device,
        place,
      ])
    )
    .map(makeCsvLine)
    .join("\r\n");

export const Actions = React.memo(() => {
  const [data, setData] = React.useState<InternalActionLogger>(null);
  const [query, setQuery] = React.useState<InternalLoggerMeta>({
    limit: 50,
    offset: 0,
    total: null,
  });

  const adminApi = useAdminApiCall();

  const handleExport = React.useCallback(
    (query: InternalLoggerMeta) =>
      adminApi("Logger/List", {
        type: "action",
        limit: 100000000,
        offset: 0,
        fromDate: query.fromDate,
        toDate: query.toDate,
      }).then(({ items }: InternalActionLogger) => formatToCsv(items)),
    [adminApi]
  );

  React.useEffect(() => {
    let handleData = setData;
    adminApi("Logger/List", {
      type: "action",
      limit: query.limit,
      offset: query.offset,
      fromDate: query.fromDate,
      toDate: query.toDate,
    }).then((data: InternalActionLogger) => handleData(data));
    return () => {
      handleData = () => {};
    };
  }, [query, adminApi]);

  return data ? (
    <>
      <ItemContent>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Device</TableCell>
                <TableCell>Place</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.items.map(
                ({ date, device, user, action, place, success }, key) => (
                  <TableRow
                    style={success ? {} : { background: "rgba(255,64,0,0.5)" }}
                    key={`${key}-${date}`}
                  >
                    <TableCell align="left">
                      {new Date(date).toLocaleString()}
                    </TableCell>
                    <TableCell align="left">{user}</TableCell>
                    <TableCell align="left">{action}</TableCell>
                    <TableCell align="left">{device}</TableCell>
                    <TableCell align="left">{place}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </ItemContent>
      <Footer meta={data.meta} onChange={setQuery} onExport={handleExport} />
    </>
  ) : (
    <Loader />
  );
});
