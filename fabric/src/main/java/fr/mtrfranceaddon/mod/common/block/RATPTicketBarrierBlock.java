package fr.mtrfranceaddon.mod.common.block;

import fr.mtrfranceaddon.mod.common.block.base.TicketBarrierBlock;
import org.mtr.mapping.holder.*;
import org.mtr.mod.block.BlockTicketBarrier;
import org.mtr.mod.block.IBlock;
import org.mtr.mod.data.TicketSystem;

import javax.annotation.Nonnull;

public class RATPTicketBarrierBlock extends BlockTicketBarrier {

    public RATPTicketBarrierBlock(boolean isEntrance) {
        super(isEntrance);
    }

    @Nonnull
    @Override
    public VoxelShape getOutlineShape2(BlockState state, BlockView world, BlockPos pos, ShapeContext context) {
        final Direction facing = IBlock.getStatePropertySafe(state, FACING);
        return IBlock.getVoxelShapeByDirection(13, 0, -7, 16, 19, 16, facing);
    }

    @Nonnull
    @Override
    public VoxelShape getCollisionShape2(BlockState state, BlockView world, BlockPos blockPos, ShapeContext context) {
        final Direction facing = IBlock.getStatePropertySafe(state, FACING);
        final TicketSystem.EnumTicketBarrierOpen open = IBlock.getStatePropertySafe(state, OPEN);
        final VoxelShape base = IBlock.getVoxelShapeByDirection(13, 0, -7, 16, 24, 21.2, facing);
        return TicketBarrierBlock.isOpen(open) ? base : VoxelShapes.union(IBlock.getVoxelShapeByDirection(0.0, 0.0, 7.0, 16.0, 24.0, 9.0, facing), base);
    }
}