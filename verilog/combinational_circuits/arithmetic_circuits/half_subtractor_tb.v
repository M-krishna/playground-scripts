module half_subtractor_tb;
    reg a, b;
    wire D, B_out;

    Half_subtractor hs(
        .a(a),
        .b(b),
        .D(D),
        .B_out(B_out)
    );

    initial begin
        #0 a = 0; b = 0;
        #1 a = 0; b = 1;
        #1 a = 1; b = 0;
        #1 a = 1; b = 1;
        #1 $finish;
    end

    initial begin
        $monitor("[Time=%0t] a=%0b b=%0b D=%0b B_out=%0b", $time, a, b, D, B_out);
    end
endmodule