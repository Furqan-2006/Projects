#include "../include/instruction.hpp"
#include <sstream>
#include <iostream>

InstructionSet::InstructionSet(CPU *c, Memory *m) : cpu(c), memory(m) {}

void InstructionSet::loadProgram(const std::vector<std::string> &progLines)
{
    program.clear();

    for (auto &line : progLines)
    {
        std::istringstream iss(line);
        Instruction inst;
        iss >> inst.opcode;

        std::string operand;
        while (iss >> operand)
        {
            if (operand.back() == ',')
                operand.pop_back();

            inst.operands.push_back(operand);
        }
        program.push_back(inst);
    }
}

void InstructionSet::execute()
{
    for (cpu->pc = 0; cpu->pc < program.size(); cpu->pc++)
    {
        Instruction inst = program[cpu->pc];
        if (inst.opcode == "MOV")
        {
            int reg = inst.operands[0][1] - '0';
            int value = std::stoi(inst.operands[1]);
            cpu->registers[reg] = value;
        }
        else if (inst.opcode == "ADD")
        {
            int reg1 = inst.operands[0][1] - '0';
            int reg2 = inst.operands[1][1] - '0';
            cpu->registers[reg1] += cpu->registers[reg2];
        }
        else if (inst.opcode == "SUB")
        {
            int reg1 = inst.operands[0][1] - '0';
            int reg2 = inst.operands[1][1] - '0';
            cpu->registers[reg1] -= cpu->registers[reg2];
        }
        else if (inst.opcode == "PRINT")
        {
            int reg = inst.operands[0][1] - '0';
            std::cout << "PRINT R" << reg << " = " << cpu->registers[reg] << "\n";
        }
        else
        {
            std::cout << "Unknown instruction: " << inst.opcode << "\n";
        }
    }
}