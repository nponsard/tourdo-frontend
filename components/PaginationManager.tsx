import { Typography } from "@mui/material";
import { Box } from "@mui/system";

export function PaginationManager(props: {
    pagination: number;
    total: number;
    currentPage: number;
    setCurrentPage: (page: number) => any;
}) {
    const max = Math.ceil(props.total / props.pagination);

    if (props.total <= props.pagination) return <></>;

    return (
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <div className="pagination-manager">
                {props.currentPage > 1 && <span onClick={() => props.setCurrentPage(1)}>1 </span>}
                {max > 3 && props.currentPage > 3 && "... "}
                {props.currentPage > 2 && max >= 3 && (
                    <span onClick={() => props.setCurrentPage(props.currentPage - 1)}>{props.currentPage - 1} </span>
                )}
                <Typography component="span" sx={{ textDecoration: "underline" }}>
                    {props.currentPage}
                </Typography>{" "}
                {props.currentPage < max - 1 && (
                    <span onClick={() => props.setCurrentPage(props.currentPage + 1)}>{props.currentPage + 1} </span>
                )}
                {max > 3 && props.currentPage < max - 2 && "... "}
                {props.currentPage < max && <span onClick={() => props.setCurrentPage(max)}>{max}</span>}
            </div>
        </Box>
    );
}
