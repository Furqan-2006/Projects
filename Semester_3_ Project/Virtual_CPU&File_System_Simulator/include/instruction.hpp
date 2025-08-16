#pragma once

#include <string>
#include <vector>
#include "memory.hpp"
#include "cpu.hpp"

struct Instruction
{
    std::string opcode;
    std::vector<std::string> operands;
};

class InstructionSet
{
private:
    std::vector<Instruction> program;
    CPU *cpu;
    Memory *memory;

public:
    InstructionSet(CPU *c, Memory *m);

    void loadProgram(const std::vector<std::string> &prog);
    void execute();
};