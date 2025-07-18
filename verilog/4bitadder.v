module 4bitadder(
    input wire [3:0] one;
    input wire [3:0] two;
    output wire [3:0] out;
);
    assign out = one + two;
endmodule