#include "../include/cpu.hpp"
#include "../include/memory.hpp"
#include "../include/instruction.hpp"
#include <vector>
#include <string>

int main()
{
    CPU cpu;
    Memory mem;
    InstructionSet instr(&cpu, &mem);

    std::vector<std::string> program = {
        "MOV R0, 5",
        "MOV R1, 5",
        "CMP R0, R1",
        "JE 6",
        "MOV R2, 99",
        "PRINT R0"};

    instr.loadProgram(program);
    instr.execute();

    cpu.printState();
    return 0;
}
